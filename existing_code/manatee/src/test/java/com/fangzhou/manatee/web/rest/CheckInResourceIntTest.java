package com.fangzhou.manatee.web.rest;

import com.fangzhou.manatee.ManateeApp;
import com.fangzhou.manatee.domain.CheckIn;
import com.fangzhou.manatee.repository.CheckInRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the CheckInResource REST controller.
 *
 * @see CheckInResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ManateeApp.class)
@WebAppConfiguration
@IntegrationTest
public class CheckInResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneId.of("Z"));


    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_TIMESTAMP_STR = dateTimeFormatter.format(DEFAULT_TIMESTAMP);

    @Inject
    private CheckInRepository checkInRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restCheckInMockMvc;

    private CheckIn checkIn;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        CheckInResource checkInResource = new CheckInResource();
        ReflectionTestUtils.setField(checkInResource, "checkInRepository", checkInRepository);
        this.restCheckInMockMvc = MockMvcBuilders.standaloneSetup(checkInResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        checkIn = new CheckIn();
        checkIn.setTimestamp(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    public void createCheckIn() throws Exception {
        int databaseSizeBeforeCreate = checkInRepository.findAll().size();

        // Create the CheckIn

        restCheckInMockMvc.perform(post("/api/check-ins")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(checkIn)))
                .andExpect(status().isCreated());

        // Validate the CheckIn in the database
        List<CheckIn> checkIns = checkInRepository.findAll();
        assertThat(checkIns).hasSize(databaseSizeBeforeCreate + 1);
        CheckIn testCheckIn = checkIns.get(checkIns.size() - 1);
        assertThat(testCheckIn.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = checkInRepository.findAll().size();
        // set the field null
        checkIn.setTimestamp(null);

        // Create the CheckIn, which fails.

        restCheckInMockMvc.perform(post("/api/check-ins")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(checkIn)))
                .andExpect(status().isBadRequest());

        List<CheckIn> checkIns = checkInRepository.findAll();
        assertThat(checkIns).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCheckIns() throws Exception {
        // Initialize the database
        checkInRepository.saveAndFlush(checkIn);

        // Get all the checkIns
        restCheckInMockMvc.perform(get("/api/check-ins?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(checkIn.getId().intValue())))
                .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP_STR)));
    }

    @Test
    @Transactional
    public void getCheckIn() throws Exception {
        // Initialize the database
        checkInRepository.saveAndFlush(checkIn);

        // Get the checkIn
        restCheckInMockMvc.perform(get("/api/check-ins/{id}", checkIn.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(checkIn.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP_STR));
    }

    @Test
    @Transactional
    public void getNonExistingCheckIn() throws Exception {
        // Get the checkIn
        restCheckInMockMvc.perform(get("/api/check-ins/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCheckIn() throws Exception {
        // Initialize the database
        checkInRepository.saveAndFlush(checkIn);
        int databaseSizeBeforeUpdate = checkInRepository.findAll().size();

        // Update the checkIn
        CheckIn updatedCheckIn = new CheckIn();
        updatedCheckIn.setId(checkIn.getId());
        updatedCheckIn.setTimestamp(UPDATED_TIMESTAMP);

        restCheckInMockMvc.perform(put("/api/check-ins")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedCheckIn)))
                .andExpect(status().isOk());

        // Validate the CheckIn in the database
        List<CheckIn> checkIns = checkInRepository.findAll();
        assertThat(checkIns).hasSize(databaseSizeBeforeUpdate);
        CheckIn testCheckIn = checkIns.get(checkIns.size() - 1);
        assertThat(testCheckIn.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    public void deleteCheckIn() throws Exception {
        // Initialize the database
        checkInRepository.saveAndFlush(checkIn);
        int databaseSizeBeforeDelete = checkInRepository.findAll().size();

        // Get the checkIn
        restCheckInMockMvc.perform(delete("/api/check-ins/{id}", checkIn.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<CheckIn> checkIns = checkInRepository.findAll();
        assertThat(checkIns).hasSize(databaseSizeBeforeDelete - 1);
    }
}

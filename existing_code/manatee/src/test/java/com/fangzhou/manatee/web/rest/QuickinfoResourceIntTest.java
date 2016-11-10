package com.fangzhou.manatee.web.rest;

import com.fangzhou.manatee.ManateeApp;
import com.fangzhou.manatee.domain.Quickinfo;
import com.fangzhou.manatee.repository.QuickinfoRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the QuickinfoResource REST controller.
 *
 * @see QuickinfoResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ManateeApp.class)
@WebAppConfiguration
@IntegrationTest
public class QuickinfoResourceIntTest {


    private static final Long DEFAULT_MRN = 1L;
    private static final Long UPDATED_MRN = 2L;
    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    private static final Long DEFAULT_ROOM_NUM = 1L;
    private static final Long UPDATED_ROOM_NUM = 2L;

    @Inject
    private QuickinfoRepository quickinfoRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restQuickinfoMockMvc;

    private Quickinfo quickinfo;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QuickinfoResource quickinfoResource = new QuickinfoResource();
        ReflectionTestUtils.setField(quickinfoResource, "quickinfoRepository", quickinfoRepository);
        this.restQuickinfoMockMvc = MockMvcBuilders.standaloneSetup(quickinfoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        quickinfo = new Quickinfo();
        quickinfo.setMrn(DEFAULT_MRN);
        quickinfo.setName(DEFAULT_NAME);
        quickinfo.setRoomNum(DEFAULT_ROOM_NUM);
    }

    @Test
    @Transactional
    public void createQuickinfo() throws Exception {
        int databaseSizeBeforeCreate = quickinfoRepository.findAll().size();

        // Create the Quickinfo

        restQuickinfoMockMvc.perform(post("/api/quickinfos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(quickinfo)))
                .andExpect(status().isCreated());

        // Validate the Quickinfo in the database
        List<Quickinfo> quickinfos = quickinfoRepository.findAll();
        assertThat(quickinfos).hasSize(databaseSizeBeforeCreate + 1);
        Quickinfo testQuickinfo = quickinfos.get(quickinfos.size() - 1);
        assertThat(testQuickinfo.getMrn()).isEqualTo(DEFAULT_MRN);
        assertThat(testQuickinfo.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQuickinfo.getRoomNum()).isEqualTo(DEFAULT_ROOM_NUM);
    }

    @Test
    @Transactional
    public void checkMrnIsRequired() throws Exception {
        int databaseSizeBeforeTest = quickinfoRepository.findAll().size();
        // set the field null
        quickinfo.setMrn(null);

        // Create the Quickinfo, which fails.

        restQuickinfoMockMvc.perform(post("/api/quickinfos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(quickinfo)))
                .andExpect(status().isBadRequest());

        List<Quickinfo> quickinfos = quickinfoRepository.findAll();
        assertThat(quickinfos).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuickinfos() throws Exception {
        // Initialize the database
        quickinfoRepository.saveAndFlush(quickinfo);

        // Get all the quickinfos
        restQuickinfoMockMvc.perform(get("/api/quickinfos?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(quickinfo.getId().intValue())))
                .andExpect(jsonPath("$.[*].mrn").value(hasItem(DEFAULT_MRN.intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].roomNum").value(hasItem(DEFAULT_ROOM_NUM.intValue())));
    }

    @Test
    @Transactional
    public void getQuickinfo() throws Exception {
        // Initialize the database
        quickinfoRepository.saveAndFlush(quickinfo);

        // Get the quickinfo
        restQuickinfoMockMvc.perform(get("/api/quickinfos/{id}", quickinfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(quickinfo.getId().intValue()))
            .andExpect(jsonPath("$.mrn").value(DEFAULT_MRN.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.roomNum").value(DEFAULT_ROOM_NUM.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingQuickinfo() throws Exception {
        // Get the quickinfo
        restQuickinfoMockMvc.perform(get("/api/quickinfos/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuickinfo() throws Exception {
        // Initialize the database
        quickinfoRepository.saveAndFlush(quickinfo);
        int databaseSizeBeforeUpdate = quickinfoRepository.findAll().size();

        // Update the quickinfo
        Quickinfo updatedQuickinfo = new Quickinfo();
        updatedQuickinfo.setId(quickinfo.getId());
        updatedQuickinfo.setMrn(UPDATED_MRN);
        updatedQuickinfo.setName(UPDATED_NAME);
        updatedQuickinfo.setRoomNum(UPDATED_ROOM_NUM);

        restQuickinfoMockMvc.perform(put("/api/quickinfos")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedQuickinfo)))
                .andExpect(status().isOk());

        // Validate the Quickinfo in the database
        List<Quickinfo> quickinfos = quickinfoRepository.findAll();
        assertThat(quickinfos).hasSize(databaseSizeBeforeUpdate);
        Quickinfo testQuickinfo = quickinfos.get(quickinfos.size() - 1);
        assertThat(testQuickinfo.getMrn()).isEqualTo(UPDATED_MRN);
        assertThat(testQuickinfo.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQuickinfo.getRoomNum()).isEqualTo(UPDATED_ROOM_NUM);
    }

    @Test
    @Transactional
    public void deleteQuickinfo() throws Exception {
        // Initialize the database
        quickinfoRepository.saveAndFlush(quickinfo);
        int databaseSizeBeforeDelete = quickinfoRepository.findAll().size();

        // Get the quickinfo
        restQuickinfoMockMvc.perform(delete("/api/quickinfos/{id}", quickinfo.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Quickinfo> quickinfos = quickinfoRepository.findAll();
        assertThat(quickinfos).hasSize(databaseSizeBeforeDelete - 1);
    }
}

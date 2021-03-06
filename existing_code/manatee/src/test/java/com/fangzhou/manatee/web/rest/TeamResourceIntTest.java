package com.fangzhou.manatee.web.rest;

import com.fangzhou.manatee.ManateeApp;
import com.fangzhou.manatee.domain.Team;
import com.fangzhou.manatee.repository.TeamRepository;

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
 * Test class for the TeamResource REST controller.
 *
 * @see TeamResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ManateeApp.class)
@WebAppConfiguration
@IntegrationTest
public class TeamResourceIntTest {

    private static final String DEFAULT_ORGANIZATION = "AAAAA";
    private static final String UPDATED_ORGANIZATION = "BBBBB";
    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_SPECIALTY = "AAAAA";
    private static final String UPDATED_SPECIALTY = "BBBBB";

    private static final Long DEFAULT_MAX_PATIENTS = 1L;
    private static final Long UPDATED_MAX_PATIENTS = 2L;

    private static final Long DEFAULT_MONDAY = 1L;
    private static final Long UPDATED_MONDAY = 2L;

    private static final Long DEFAULT_TUESDAY = 1L;
    private static final Long UPDATED_TUESDAY = 2L;

    private static final Long DEFAULT_WEDNESDAY = 1L;
    private static final Long UPDATED_WEDNESDAY = 2L;

    private static final Long DEFAULT_THURSDAY = 1L;
    private static final Long UPDATED_THURSDAY = 2L;

    private static final Long DEFAULT_FRIDAY = 1L;
    private static final Long UPDATED_FRIDAY = 2L;

    private static final Long DEFAULT_SATURDAY = 1L;
    private static final Long UPDATED_SATURDAY = 2L;

    private static final Long DEFAULT_SUNDAY = 1L;
    private static final Long UPDATED_SUNDAY = 2L;

    @Inject
    private TeamRepository teamRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restTeamMockMvc;

    private Team team;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        TeamResource teamResource = new TeamResource();
        ReflectionTestUtils.setField(teamResource, "teamRepository", teamRepository);
        this.restTeamMockMvc = MockMvcBuilders.standaloneSetup(teamResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        team = new Team();
        team.setOrganization(DEFAULT_ORGANIZATION);
        team.setName(DEFAULT_NAME);
        team.setSpecialty(DEFAULT_SPECIALTY);
        team.setMaxPatients(DEFAULT_MAX_PATIENTS);
        team.setMonday(DEFAULT_MONDAY);
        team.setTuesday(DEFAULT_TUESDAY);
        team.setWednesday(DEFAULT_WEDNESDAY);
        team.setThursday(DEFAULT_THURSDAY);
        team.setFriday(DEFAULT_FRIDAY);
        team.setSaturday(DEFAULT_SATURDAY);
        team.setSunday(DEFAULT_SUNDAY);
    }

    @Test
    @Transactional
    public void createTeam() throws Exception {
        int databaseSizeBeforeCreate = teamRepository.findAll().size();

        // Create the Team

        restTeamMockMvc.perform(post("/api/teams")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(team)))
                .andExpect(status().isCreated());

        // Validate the Team in the database
        List<Team> teams = teamRepository.findAll();
        assertThat(teams).hasSize(databaseSizeBeforeCreate + 1);
        Team testTeam = teams.get(teams.size() - 1);
        assertThat(testTeam.getOrganization()).isEqualTo(DEFAULT_ORGANIZATION);
        assertThat(testTeam.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTeam.getSpecialty()).isEqualTo(DEFAULT_SPECIALTY);
        assertThat(testTeam.getMaxPatients()).isEqualTo(DEFAULT_MAX_PATIENTS);
        assertThat(testTeam.getMonday()).isEqualTo(DEFAULT_MONDAY);
        assertThat(testTeam.getTuesday()).isEqualTo(DEFAULT_TUESDAY);
        assertThat(testTeam.getWednesday()).isEqualTo(DEFAULT_WEDNESDAY);
        assertThat(testTeam.getThursday()).isEqualTo(DEFAULT_THURSDAY);
        assertThat(testTeam.getFriday()).isEqualTo(DEFAULT_FRIDAY);
        assertThat(testTeam.getSaturday()).isEqualTo(DEFAULT_SATURDAY);
        assertThat(testTeam.getSunday()).isEqualTo(DEFAULT_SUNDAY);
    }

    @Test
    @Transactional
    public void getAllTeams() throws Exception {
        // Initialize the database
        teamRepository.saveAndFlush(team);

        // Get all the teams
        restTeamMockMvc.perform(get("/api/teams?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(team.getId().intValue())))
                .andExpect(jsonPath("$.[*].organization").value(hasItem(DEFAULT_ORGANIZATION.toString())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].specialty").value(hasItem(DEFAULT_SPECIALTY.toString())))
                .andExpect(jsonPath("$.[*].maxPatients").value(hasItem(DEFAULT_MAX_PATIENTS.intValue())))
                .andExpect(jsonPath("$.[*].monday").value(hasItem(DEFAULT_MONDAY.intValue())))
                .andExpect(jsonPath("$.[*].tuesday").value(hasItem(DEFAULT_TUESDAY.intValue())))
                .andExpect(jsonPath("$.[*].wednesday").value(hasItem(DEFAULT_WEDNESDAY.intValue())))
                .andExpect(jsonPath("$.[*].thursday").value(hasItem(DEFAULT_THURSDAY.intValue())))
                .andExpect(jsonPath("$.[*].friday").value(hasItem(DEFAULT_FRIDAY.intValue())))
                .andExpect(jsonPath("$.[*].saturday").value(hasItem(DEFAULT_SATURDAY.intValue())))
                .andExpect(jsonPath("$.[*].sunday").value(hasItem(DEFAULT_SUNDAY.intValue())));
    }

    @Test
    @Transactional
    public void getTeam() throws Exception {
        // Initialize the database
        teamRepository.saveAndFlush(team);

        // Get the team
        restTeamMockMvc.perform(get("/api/teams/{id}", team.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(team.getId().intValue()))
            .andExpect(jsonPath("$.organization").value(DEFAULT_ORGANIZATION.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.specialty").value(DEFAULT_SPECIALTY.toString()))
            .andExpect(jsonPath("$.maxPatients").value(DEFAULT_MAX_PATIENTS.intValue()))
            .andExpect(jsonPath("$.monday").value(DEFAULT_MONDAY.intValue()))
            .andExpect(jsonPath("$.tuesday").value(DEFAULT_TUESDAY.intValue()))
            .andExpect(jsonPath("$.wednesday").value(DEFAULT_WEDNESDAY.intValue()))
            .andExpect(jsonPath("$.thursday").value(DEFAULT_THURSDAY.intValue()))
            .andExpect(jsonPath("$.friday").value(DEFAULT_FRIDAY.intValue()))
            .andExpect(jsonPath("$.saturday").value(DEFAULT_SATURDAY.intValue()))
            .andExpect(jsonPath("$.sunday").value(DEFAULT_SUNDAY.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTeam() throws Exception {
        // Get the team
        restTeamMockMvc.perform(get("/api/teams/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTeam() throws Exception {
        // Initialize the database
        teamRepository.saveAndFlush(team);
        int databaseSizeBeforeUpdate = teamRepository.findAll().size();

        // Update the team
        Team updatedTeam = new Team();
        updatedTeam.setId(team.getId());
        updatedTeam.setOrganization(UPDATED_ORGANIZATION);
        updatedTeam.setName(UPDATED_NAME);
        updatedTeam.setSpecialty(UPDATED_SPECIALTY);
        updatedTeam.setMaxPatients(UPDATED_MAX_PATIENTS);
        updatedTeam.setMonday(UPDATED_MONDAY);
        updatedTeam.setTuesday(UPDATED_TUESDAY);
        updatedTeam.setWednesday(UPDATED_WEDNESDAY);
        updatedTeam.setThursday(UPDATED_THURSDAY);
        updatedTeam.setFriday(UPDATED_FRIDAY);
        updatedTeam.setSaturday(UPDATED_SATURDAY);
        updatedTeam.setSunday(UPDATED_SUNDAY);

        restTeamMockMvc.perform(put("/api/teams")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedTeam)))
                .andExpect(status().isOk());

        // Validate the Team in the database
        List<Team> teams = teamRepository.findAll();
        assertThat(teams).hasSize(databaseSizeBeforeUpdate);
        Team testTeam = teams.get(teams.size() - 1);
        assertThat(testTeam.getOrganization()).isEqualTo(UPDATED_ORGANIZATION);
        assertThat(testTeam.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTeam.getSpecialty()).isEqualTo(UPDATED_SPECIALTY);
        assertThat(testTeam.getMaxPatients()).isEqualTo(UPDATED_MAX_PATIENTS);
        assertThat(testTeam.getMonday()).isEqualTo(UPDATED_MONDAY);
        assertThat(testTeam.getTuesday()).isEqualTo(UPDATED_TUESDAY);
        assertThat(testTeam.getWednesday()).isEqualTo(UPDATED_WEDNESDAY);
        assertThat(testTeam.getThursday()).isEqualTo(UPDATED_THURSDAY);
        assertThat(testTeam.getFriday()).isEqualTo(UPDATED_FRIDAY);
        assertThat(testTeam.getSaturday()).isEqualTo(UPDATED_SATURDAY);
        assertThat(testTeam.getSunday()).isEqualTo(UPDATED_SUNDAY);
    }

    @Test
    @Transactional
    public void deleteTeam() throws Exception {
        // Initialize the database
        teamRepository.saveAndFlush(team);
        int databaseSizeBeforeDelete = teamRepository.findAll().size();

        // Get the team
        restTeamMockMvc.perform(delete("/api/teams/{id}", team.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Team> teams = teamRepository.findAll();
        assertThat(teams).hasSize(databaseSizeBeforeDelete - 1);
    }
}

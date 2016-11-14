package com.fangzhou.manatee.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.manatee.domain.CheckIn;
import com.fangzhou.manatee.repository.CheckInRepository;
import com.fangzhou.manatee.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing CheckIn.
 */
@RestController
@RequestMapping("/api")
public class CheckInResource {

    private final Logger log = LoggerFactory.getLogger(CheckInResource.class);
        
    @Inject
    private CheckInRepository checkInRepository;
    
    /**
     * POST  /check-ins : Create a new checkIn.
     *
     * @param checkIn the checkIn to create
     * @return the ResponseEntity with status 201 (Created) and with body the new checkIn, or with status 400 (Bad Request) if the checkIn has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/check-ins",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CheckIn> createCheckIn(@Valid @RequestBody CheckIn checkIn) throws URISyntaxException {
        log.debug("REST request to save CheckIn : {}", checkIn);
        if (checkIn.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("checkIn", "idexists", "A new checkIn cannot already have an ID")).body(null);
        }
        CheckIn result = checkInRepository.save(checkIn);
        return ResponseEntity.created(new URI("/api/check-ins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("checkIn", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /check-ins : Updates an existing checkIn.
     *
     * @param checkIn the checkIn to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated checkIn,
     * or with status 400 (Bad Request) if the checkIn is not valid,
     * or with status 500 (Internal Server Error) if the checkIn couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/check-ins",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CheckIn> updateCheckIn(@Valid @RequestBody CheckIn checkIn) throws URISyntaxException {
        log.debug("REST request to update CheckIn : {}", checkIn);
        if (checkIn.getId() == null) {
            return createCheckIn(checkIn);
        }
        CheckIn result = checkInRepository.save(checkIn);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("checkIn", checkIn.getId().toString()))
            .body(result);
    }

    /**
     * GET  /check-ins : get all the checkIns.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of checkIns in body
     */
    @RequestMapping(value = "/check-ins",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<CheckIn> getAllCheckIns() {
        log.debug("REST request to get all CheckIns");
        List<CheckIn> checkIns = checkInRepository.findAll();
        return checkIns;
    }

    /**
     * GET  /check-ins/:id : get the "id" checkIn.
     *
     * @param id the id of the checkIn to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the checkIn, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/check-ins/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CheckIn> getCheckIn(@PathVariable Long id) {
        log.debug("REST request to get CheckIn : {}", id);
        CheckIn checkIn = checkInRepository.findOne(id);
        return Optional.ofNullable(checkIn)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /check-ins/:id : delete the "id" checkIn.
     *
     * @param id the id of the checkIn to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/check-ins/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCheckIn(@PathVariable Long id) {
        log.debug("REST request to delete CheckIn : {}", id);
        checkInRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("checkIn", id.toString())).build();
    }

}

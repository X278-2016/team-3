package com.fangzhou.manatee.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.manatee.domain.Quickinfo;
import com.fangzhou.manatee.repository.QuickinfoRepository;
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
 * REST controller for managing Quickinfo.
 */
@RestController
@RequestMapping("/api")
public class QuickinfoResource {

    private final Logger log = LoggerFactory.getLogger(QuickinfoResource.class);
        
    @Inject
    private QuickinfoRepository quickinfoRepository;
    
    /**
     * POST  /quickinfos : Create a new quickinfo.
     *
     * @param quickinfo the quickinfo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new quickinfo, or with status 400 (Bad Request) if the quickinfo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/quickinfos",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Quickinfo> createQuickinfo(@Valid @RequestBody Quickinfo quickinfo) throws URISyntaxException {
        log.debug("REST request to save Quickinfo : {}", quickinfo);
        if (quickinfo.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("quickinfo", "idexists", "A new quickinfo cannot already have an ID")).body(null);
        }
        Quickinfo result = quickinfoRepository.save(quickinfo);
        return ResponseEntity.created(new URI("/api/quickinfos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("quickinfo", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /quickinfos : Updates an existing quickinfo.
     *
     * @param quickinfo the quickinfo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated quickinfo,
     * or with status 400 (Bad Request) if the quickinfo is not valid,
     * or with status 500 (Internal Server Error) if the quickinfo couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/quickinfos",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Quickinfo> updateQuickinfo(@Valid @RequestBody Quickinfo quickinfo) throws URISyntaxException {
        log.debug("REST request to update Quickinfo : {}", quickinfo);
        if (quickinfo.getId() == null) {
            return createQuickinfo(quickinfo);
        }
        Quickinfo result = quickinfoRepository.save(quickinfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("quickinfo", quickinfo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /quickinfos : get all the quickinfos.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of quickinfos in body
     */
    @RequestMapping(value = "/quickinfos",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Quickinfo> getAllQuickinfos() {
        log.debug("REST request to get all Quickinfos");
        List<Quickinfo> quickinfos = quickinfoRepository.findAll();
        return quickinfos;
    }

    /**
     * GET  /quickinfos/:id : get the "id" quickinfo.
     *
     * @param id the id of the quickinfo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the quickinfo, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/quickinfos/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Quickinfo> getQuickinfo(@PathVariable Long id) {
        log.debug("REST request to get Quickinfo : {}", id);
        Quickinfo quickinfo = quickinfoRepository.findOne(id);
        return Optional.ofNullable(quickinfo)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /quickinfos/:id : delete the "id" quickinfo.
     *
     * @param id the id of the quickinfo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/quickinfos/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteQuickinfo(@PathVariable Long id) {
        log.debug("REST request to delete Quickinfo : {}", id);
        quickinfoRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("quickinfo", id.toString())).build();
    }

}

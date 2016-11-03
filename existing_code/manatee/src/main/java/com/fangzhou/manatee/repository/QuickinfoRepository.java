package com.fangzhou.manatee.repository;

import com.fangzhou.manatee.domain.Quickinfo;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Quickinfo entity.
 */
@SuppressWarnings("unused")
public interface QuickinfoRepository extends JpaRepository<Quickinfo,Long> {

}

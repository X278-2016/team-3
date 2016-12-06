package com.fangzhou.manatee.repository;

import com.fangzhou.manatee.domain.CheckIn;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CheckIn entity.
 */
@SuppressWarnings("unused")
public interface CheckInRepository extends JpaRepository<CheckIn,Long> {

}

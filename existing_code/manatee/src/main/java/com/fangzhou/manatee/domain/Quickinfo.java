package com.fangzhou.manatee.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Quickinfo.
 */
@Entity
@Table(name = "quickinfo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Quickinfo extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "mrn", nullable = false)
    private Long mrn;

    @Column(name = "name")
    private String name;

    @Column(name = "room_num")
    private Long roomNum;

    @OneToOne
    @JoinColumn(unique = true)
    private Patient patient;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMrn() {
        return mrn;
    }

    public void setMrn(Long mrn) {
        this.mrn = mrn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getRoomNum() {
        return roomNum;
    }

    public void setRoomNum(Long roomNum) {
        this.roomNum = roomNum;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Quickinfo quickinfo = (Quickinfo) o;
        if(quickinfo.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, quickinfo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Quickinfo{" +
            "id=" + id +
            ", mrn='" + mrn + "'" +
            ", name='" + name + "'" +
            ", roomNum='" + roomNum + "'" +
            '}';
    }
}

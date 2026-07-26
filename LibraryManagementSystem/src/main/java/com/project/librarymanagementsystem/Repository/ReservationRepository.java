package com.project.librarymanagementsystem.Repository;

import com.project.librarymanagementsystem.Entity.Reservation;
import com.project.librarymanagementsystem.Enum.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByMemberId(Long memberId);
    List<Reservation> findByBookId(Long bookId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByMemberIdAndStatus(Long memberId, ReservationStatus status);
}

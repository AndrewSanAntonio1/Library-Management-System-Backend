package com.project.librarymanagementsystem.Repository;

import com.project.librarymanagementsystem.Entity.Fine;
import com.project.librarymanagementsystem.Enum.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByMemberId(Long memberId);
    List<Fine> findByStatus(FineStatus status);
}

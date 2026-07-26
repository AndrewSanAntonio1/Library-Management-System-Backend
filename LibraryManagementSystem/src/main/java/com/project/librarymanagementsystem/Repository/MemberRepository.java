package com.project.librarymanagementsystem.Repository;

import com.project.librarymanagementsystem.Entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMembershipNumber(String membershipNumber);
    Optional<Member> findByUserId(Long userId);
    boolean existsByMembershipNumber(String membershipNumber);
}

package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.MemberRequest;
import com.project.librarymanagementsystem.DTO.MemberResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Entity.Member;
import com.project.librarymanagementsystem.Entity.User;
import com.project.librarymanagementsystem.Mapper.MemberMapper;
import com.project.librarymanagementsystem.Repository.MemberRepository;
import com.project.librarymanagementsystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final MemberMapper memberMapper;

    public MemberResponse createMember(MemberRequest request) {
        if (memberRepository.existsByMembershipNumber(request.membershipNumber())) {
            throw new RuntimeException("Membership number already exists");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Member member = memberMapper.toEntity(request);
        member.setUser(user);

        Member savedMember = memberRepository.save(member);
        return memberMapper.toResponse(savedMember);
    }

    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(memberMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MemberResponse getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return memberMapper.toResponse(member);
    }

    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        member.setUser(user);
        member.setMembershipNumber(request.membershipNumber());
        member.setAddress(request.address());
        member.setMembershipStartDate(request.membershipStartDate());
        member.setMembershipExpiryDate(request.membershipExpiryDate());

        Member updatedMember = memberRepository.save(member);
        return memberMapper.toResponse(updatedMember);
    }

    public MessageResponse deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        memberRepository.delete(member);
        return new MessageResponse("Member deleted successfully");
    }
}

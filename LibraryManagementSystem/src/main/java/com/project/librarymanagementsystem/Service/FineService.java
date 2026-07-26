package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.FineRequest;
import com.project.librarymanagementsystem.DTO.FineResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Entity.Fine;
import com.project.librarymanagementsystem.Entity.Member;
import com.project.librarymanagementsystem.Mapper.FineMapper;
import com.project.librarymanagementsystem.Repository.FineRepository;
import com.project.librarymanagementsystem.Repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FineService {
    private final FineRepository fineRepository;
    private final MemberRepository memberRepository;
    private final FineMapper fineMapper;

    public FineResponse createFine(FineRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Fine fine = fineMapper.toEntity(request);
        fine.setMember(member);

        Fine savedFine = fineRepository.save(fine);
        return fineMapper.toResponse(savedFine);
    }

    public List<FineResponse> getAllFines() {
        return fineRepository.findAll().stream()
                .map(fineMapper::toResponse)
                .collect(Collectors.toList());
    }

    public FineResponse getFineById(Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));
        return fineMapper.toResponse(fine);
    }

    public FineResponse updateFine(Long id, FineRequest request) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        fine.setMember(member);
        fine.setAmount(request.amount());
        fine.setReason(request.reason());
        fine.setStatus(request.status());
        fine.setPaymentDate(request.paymentDate());

        Fine updatedFine = fineRepository.save(fine);
        return fineMapper.toResponse(updatedFine);
    }

    public MessageResponse deleteFine(Long id) {
        Fine fine = fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        fineRepository.delete(fine);
        return new MessageResponse("Fine deleted successfully");
    }
}

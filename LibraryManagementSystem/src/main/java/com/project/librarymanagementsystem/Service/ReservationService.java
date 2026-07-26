package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.DTO.ReservationRequest;
import com.project.librarymanagementsystem.DTO.ReservationResponse;
import com.project.librarymanagementsystem.Entity.Book;
import com.project.librarymanagementsystem.Entity.Member;
import com.project.librarymanagementsystem.Entity.Reservation;
import com.project.librarymanagementsystem.Mapper.ReservationMapper;
import com.project.librarymanagementsystem.Repository.BookRepository;
import com.project.librarymanagementsystem.Repository.MemberRepository;
import com.project.librarymanagementsystem.Repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final ReservationMapper reservationMapper;

    public ReservationResponse createReservation(ReservationRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setMember(member);
        reservation.setBook(book);

        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponse(savedReservation);
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return reservationMapper.toResponse(reservation);
    }

    public ReservationResponse updateReservation(Long id, ReservationRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        reservation.setMember(member);
        reservation.setBook(book);
        reservation.setReservationDate(request.reservationDate());
        reservation.setExpiryDate(request.expiryDate());
        reservation.setStatus(request.status());

        Reservation updatedReservation = reservationRepository.save(reservation);
        return reservationMapper.toResponse(updatedReservation);
    }

    public MessageResponse deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservationRepository.delete(reservation);
        return new MessageResponse("Reservation deleted successfully");
    }
}

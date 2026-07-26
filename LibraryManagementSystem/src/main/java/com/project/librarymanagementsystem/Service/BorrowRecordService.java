package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.BorrowRecordRequest;
import com.project.librarymanagementsystem.DTO.BorrowRecordResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Entity.Book;
import com.project.librarymanagementsystem.Entity.BorrowRecord;
import com.project.librarymanagementsystem.Entity.Member;
import com.project.librarymanagementsystem.Mapper.BorrowRecordMapper;
import com.project.librarymanagementsystem.Repository.BookRepository;
import com.project.librarymanagementsystem.Repository.BorrowRecordRepository;
import com.project.librarymanagementsystem.Repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowRecordService {
    private final BorrowRecordRepository borrowRecordRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordMapper borrowRecordMapper;

    public BorrowRecordResponse createBorrowRecord(BorrowRecordRequest request) {
        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BorrowRecord borrowRecord = borrowRecordMapper.toEntity(request);
        borrowRecord.setMember(member);
        borrowRecord.setBook(book);

        BorrowRecord savedBorrowRecord = borrowRecordRepository.save(borrowRecord);
        return borrowRecordMapper.toResponse(savedBorrowRecord);
    }

    public List<BorrowRecordResponse> getAllBorrowRecords() {
        return borrowRecordRepository.findAll().stream()
                .map(borrowRecordMapper::toResponse)
                .collect(Collectors.toList());
    }

    public BorrowRecordResponse getBorrowRecordById(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));
        return borrowRecordMapper.toResponse(borrowRecord);
    }

    public BorrowRecordResponse updateBorrowRecord(Long id, BorrowRecordRequest request) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        Member member = memberRepository.findById(request.memberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        borrowRecord.setMember(member);
        borrowRecord.setBook(book);
        borrowRecord.setBorrowDate(request.borrowDate());
        borrowRecord.setDueDate(request.dueDate());
        borrowRecord.setReturnDate(request.returnDate());
        borrowRecord.setStatus(request.status());

        BorrowRecord updatedBorrowRecord = borrowRecordRepository.save(borrowRecord);
        return borrowRecordMapper.toResponse(updatedBorrowRecord);
    }

    public MessageResponse deleteBorrowRecord(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        borrowRecordRepository.delete(borrowRecord);
        return new MessageResponse("Borrow record deleted successfully");
    }
}

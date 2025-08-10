package com.examly.springapp.model;

import java.time.LocalDateTime;



import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(nullable=false,unique=true)
    private String email;

    @Column(nullable=false)
    private String password;


    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private Role role;

    @Column
    private String phoneNumber;

    @Column(updatable =false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate()
    {
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate()
    {
        this.updatedAt=LocalDateTime.now();
    }

    public enum Role
    {
        CUSTOMER,ADMIN;
    }

}
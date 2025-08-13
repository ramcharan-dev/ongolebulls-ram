///*
//package dev.ongolebulls.repository;
//
//import dev.ongolebulls.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//
//@Repository
//public interface UserRepository extends JpaRepository<User, Long> {
//
//    Optional<User> findByUsername(String username);
//
//    Optional<User> findByUsernameOrMobile(String username, String mobile);
//}
//*/
//
//
//package dev.ongolebulls.repository;
//
//import dev.ongolebulls.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//    Optional<User> findByUsername(String username);
//
//    Optional<User> findByUsernameOrMobile(String username, String mobile);
//
//    Optional<User> findByVerificationToken(String token);
//
//    Optional<User> findByUsernameOrEmail(String username, String username1);
//}
package dev.ongolebulls.repository;

import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile); // keep only this
}

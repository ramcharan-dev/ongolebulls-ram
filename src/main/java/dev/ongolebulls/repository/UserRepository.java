/*
package dev.ongolebulls.repository;

import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameOrMobile(String username, String mobile);
}
*/
package dev.ongolebulls.repository;

import dev.ongolebulls.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNumber(String mobileNumber); // ✅ match field name
    Optional<User> findByEmailOrMobileNumber(String email, String mobileNumber); // ✅ fixed

}

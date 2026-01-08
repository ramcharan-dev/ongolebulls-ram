package dev.ongolebulls.controller;

import dev.ongolebulls.dto.NotificationDto;
import dev.ongolebulls.model.Activity;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.ActivityRepository;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public NotificationController(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) Boolean unreadOnly) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<Activity> activities;

        if (unreadOnly != null && unreadOnly) {
            activities = activityRepository.findByUserAndReadFalseOrderByTimestampDesc(user);
        } else {
            activities = activityRepository.findByUserOrderByTimestampDesc(user);
        }

        List<NotificationDto> notifications = activities.stream()
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<?> getUnreadCount(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        long count = activityRepository.countByUserAndReadFalse(user);
        
        return ResponseEntity.ok(java.util.Map.of("count", count));
    }

    @PutMapping("/{userId}/read/{notificationId}")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long userId,
            @PathVariable Long notificationId) {
        
        Optional<Activity> activityOpt = activityRepository.findById(notificationId);
        if (activityOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Activity activity = activityOpt.get();
        
        // Verify the activity belongs to the user
        Object user = getField(activity, "user");
        if (user == null) {
            return ResponseEntity.badRequest().body("Activity has no user");
        }
        
        Object userIdField = getField(user, "id");
        if (userIdField == null || !userIdField.equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        activity.setRead(true);
        activityRepository.save(activity);

        return ResponseEntity.ok(java.util.Map.of("success", true));
    }

    @PutMapping("/{userId}/read-all")
    public ResponseEntity<?> markAllAsRead(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<Activity> unreadActivities = activityRepository.findByUserAndReadFalseOrderByTimestampDesc(user);
        
        unreadActivities.forEach(activity -> activity.setRead(true));
        activityRepository.saveAll(unreadActivities);

        return ResponseEntity.ok(java.util.Map.of("success", true, "marked", unreadActivities.size()));
    }

    private NotificationDto convertToDto(Activity activity) {
        NotificationDto dto = new NotificationDto();
        Object id = getField(activity, "id");
        Object type = getField(activity, "type");
        Object title = getField(activity, "title");
        Object description = getField(activity, "description");
        Object timestamp = getField(activity, "timestamp");
        Object read = getField(activity, "read");
        Object actionUrl = getField(activity, "actionUrl");

        if (id != null && id instanceof Long) {
            dto.setId((Long) id);
        }
        dto.setType(type != null ? type.toString() : "");
        dto.setTitle(title != null ? title.toString() : "");
        dto.setDescription(description != null ? description.toString() : "");
        if (timestamp != null && timestamp instanceof LocalDateTime) {
            dto.setTimestamp((LocalDateTime) timestamp);
        }
        dto.setRead(read != null ? (Boolean) read : false);
        dto.setActionUrl(actionUrl != null ? actionUrl.toString() : null);

        return dto;
    }
}



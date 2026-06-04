package com.example.Rendez_vous_prise_container.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    @GetMapping
    public List<AuditLogEntry> getAll() {
        return List.of(
                new AuditLogEntry(
                        "a1",
                        "2026-05-10T09:14:00.000Z",
                        "u1",
                        "CREATE_APPOINTMENT",
                        Map.of("appointmentId", "app1"),
                        Map.of("transporterUserId", "u2", "containerId", "c3")
                ),
                new AuditLogEntry(
                        "a2",
                        "2026-05-10T10:02:00.000Z",
                        "u1",
                        "APPROVE_APPOINTMENT",
                        Map.of("appointmentId", "app1"),
                        Map.of("scheduledFor", "2026-05-12T08:30:00.000Z")
                ),
                new AuditLogEntry(
                        "a3",
                        "2026-05-11T12:30:00.000Z",
                        "u2",
                        "UPDATE_STATUS",
                        Map.of("appointmentId", "app1"),
                        Map.of("status", "approved")
                ),
                new AuditLogEntry(
                        "a4",
                        "2026-05-11T15:05:00.000Z",
                        "u1",
                        "REJECT_APPOINTMENT",
                        Map.of("appointmentId", "app2"),
                        Map.of("reason", "Container not available")
                ),
                new AuditLogEntry(
                        "a5",
                        "2026-05-12T08:40:00.000Z",
                        "u1",
                        "CREATE_APPOINTMENT",
                        Map.of("appointmentId", "app3"),
                        Map.of("transporterUserId", "u3", "containerId", "c7")
                ),
                new AuditLogEntry(
                        "a6",
                        "2026-05-12T09:00:00.000Z",
                        "u3",
                        "UPDATE_STATUS",
                        Map.of("appointmentId", "app3"),
                        Map.of("status", "pending")
                )
        );
    }

    public static record AuditLogEntry(
            String id,
            String at,
            String actorUserId,
            String action,
            Map<String, Object> target,
            Map<String, Object> meta
    ) {
    }
}

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/models/status_info.dart';
import 'package:myapp/pages/appointments/widgets/my_row.dart';

class AppointmentCard extends StatelessWidget {
  final AppointmentModel appointment;
  final bool showCancel;
  final VoidCallback onCancel;
  final VoidCallback onTap;

  const AppointmentCard({
    required this.appointment,
    required this.showCancel,
    required this.onCancel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final status = _statusInfo(appointment.status);

    return GestureDetector(
      onTap: onTap,
      child: Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: status.color.withValues(alpha: 0.08),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                Icon(status.icon, size: 16, color: status.color),
                const SizedBox(width: 6),
                Text(status.label,
                    style: TextStyle(
                        color: status.color, fontWeight: FontWeight.bold, fontSize: 13)),
                const Spacer(),
                Text(appointment.appointmentDate,
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Bác sĩ
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: const Color(0xFF00B4D8).withValues(alpha: 0.12),
                      backgroundImage: appointment.doctor.avatarUrl.isNotEmpty
                          ? NetworkImage(appointment.doctor.avatarUrl)
                          : null,
                      child: appointment.doctor.avatarUrl.isEmpty
                          ? const Icon(Icons.person, color: Color(0xFF00B4D8))
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(appointment.doctor.fullName,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 15)),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              const Icon(Icons.access_time, size: 14, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(appointment.schedule.displayTime,
                                  style: const TextStyle(color: Colors.grey, fontSize: 13)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const Divider(height: 20),

                MyRow(icon: Icons.person_outline, label: "Hồ sơ", value: appointment.patient.fullName),

                if (appointment.symptoms.isNotEmpty)
                  MyRow(icon: Icons.notes_outlined, label: "Triệu chứng", value: appointment.symptoms),

                if (appointment.cancelReason != null &&
                    appointment.cancelReason!.isNotEmpty)
                  MyRow(icon: Icons.cancel_outlined, label: "Lý do hủy", value: appointment.cancelReason!),

                if (showCancel) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: onCancel,
                      icon: const Icon(Icons.cancel_outlined, size: 18),
                      label: const Text("Hủy lịch hẹn"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: const BorderSide(color: Colors.red),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    ), // Container
    ); // GestureDetector
  }
  StatusInfo _statusInfo(String status) {
    switch (status) {
      case 'PENDING':
        return StatusInfo('Chờ xác nhận', Icons.hourglass_top_outlined, Colors.orange);
      case 'CONFIRMED':
        return StatusInfo('Đã xác nhận', Icons.check_circle_outline, Color(0xFF00B4D8));
      case 'COMPLETED':
        return StatusInfo('Hoàn thành', Icons.task_alt, Colors.green);
      case 'CANCELLED':
        return StatusInfo('Đã hủy', Icons.cancel_outlined, Colors.red);
      default:
        return StatusInfo(status, Icons.info_outline, Colors.grey);
    }
  }
}

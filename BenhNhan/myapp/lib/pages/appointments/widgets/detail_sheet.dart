import 'package:flutter/material.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/models/status_info.dart';
import 'package:myapp/pages/appointments/widgets/my_detail_row.dart';

class DetailSheet extends StatelessWidget {
  final AppointmentModel appointment;
  final VoidCallback? onCancel;

  const DetailSheet({required this.appointment, this.onCancel});

  @override
  Widget build(BuildContext context) {
    final status = _statusColor(appointment.status);

    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.4,
      maxChildSize: 0.9,
      expand: false,
      builder: (_, controller) => ListView(
        controller: controller,
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          Center(
            child: Container(
              width: 40, height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2)),
            ),
          ),

          // Trạng thái
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: status.color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(status.icon, size: 16, color: status.color),
                const SizedBox(width: 6),
                Text(status.label,
                    style: TextStyle(
                        color: status.color,
                        fontWeight: FontWeight.bold,
                        fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          const Text("Bác sĩ",
              style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: const Color(0xFF00B4D8).withValues(alpha: 0.12),
                backgroundImage: appointment.doctor.avatarUrl.isNotEmpty
                    ? NetworkImage(appointment.doctor.avatarUrl)
                    : null,
                child: appointment.doctor.avatarUrl.isEmpty
                    ? const Icon(Icons.person, color: Color(0xFF00B4D8), size: 28)
                    : null,
              ),
              const SizedBox(width: 14),
              Text(appointment.doctor.fullName,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),

          const Divider(height: 28),

          const Text("Chi tiết lịch hẹn",
              style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          MyDetailRow(icon: Icons.calendar_today_outlined, label: "Ngày khám", value: appointment.appointmentDate),
          MyDetailRow(icon: Icons.access_time_outlined, label: "Giờ khám", value: appointment.schedule.displayTime),
          MyDetailRow(icon: Icons.person_outline, label: "Hồ sơ bệnh nhân", value: appointment.patient.fullName),
          if (appointment.symptoms.isNotEmpty)
            MyDetailRow(icon: Icons.notes_outlined, label: "Triệu chứng", value: appointment.symptoms),
          if (appointment.cancelReason != null && appointment.cancelReason!.isNotEmpty)
            MyDetailRow(icon: Icons.cancel_outlined, label: "Lý do hủy", value: appointment.cancelReason!),

          if (onCancel != null) ...[
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onCancel,
                icon: const Icon(Icons.cancel_outlined, size: 18),
                label: const Text("Hủy lịch hẹn"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  StatusInfo _statusColor(String status) {
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
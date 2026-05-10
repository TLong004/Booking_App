import 'package:flutter/material.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/pages/records/widgets/info_row.dart';
import 'package:myapp/pages/records/widgets/my_sheet.dart';

class MyPatientCard extends StatelessWidget {
  final PatientModel patient;
  const MyPatientCard({super.key, required this.patient});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 8)],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: const Color(0xFF00B4D8).withValues(alpha: 0.12),
                  child: const Icon(Icons.person, color: Color(0xFF00B4D8), size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(patient.fullName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 2),
                      Text(
                        "${patient.gender} • ${patient.dob.isNotEmpty ? patient.dob : 'Chưa có ngày sinh'}",
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.edit_outlined, color: Color(0xFF00B4D8), size: 22),
                  tooltip: "Sửa",
                  onPressed: () => MySheet.showEditSheet(context, patient),
                ),
                IconButton(
                  icon: Icon(Icons.delete_outline, color: Colors.red.shade400, size: 22),
                  tooltip: "Xóa",
                  onPressed: () => MySheet.confirmDelete(context, patient),
                ),
              ],
            ),
            if (patient.phoneNumber.isNotEmpty || patient.address.isNotEmpty) ...[
              const Divider(height: 20),
              if (patient.phoneNumber.isNotEmpty)
                InfoRow( icon: Icons.phone_outlined, text: patient.phoneNumber),
              if (patient.address.isNotEmpty)
                InfoRow( icon: Icons.location_on_outlined, text: patient.address),
            ],
          ],
        ),
      ),
    );
  }
}
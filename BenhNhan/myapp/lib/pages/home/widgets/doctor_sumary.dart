import 'package:flutter/material.dart';
import 'package:myapp/models/doctor.dart';

class DoctorSumary extends StatelessWidget {
  final DoctorModel doctor;
  const DoctorSumary({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.cyan.shade50,
            backgroundImage: doctor.avatarUrl.isNotEmpty ? NetworkImage(doctor.avatarUrl) : null,
            child: doctor.avatarUrl.isEmpty ? const Icon(Icons.person, size: 30, color: Color(0xFF00B4D8)) : null,
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doctor.fullName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(doctor.specialtyName, style: const TextStyle(color: Colors.grey, fontSize: 13)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
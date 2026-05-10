import 'package:flutter/material.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/pages/home/screens/profile_doctor.dart';

class DoctorItem extends StatelessWidget {
  final DoctorModel doctor;
  const DoctorItem({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(
              color: Colors.cyan.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: doctor.avatarUrl.isNotEmpty
            ? ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  doctor.avatarUrl, 
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => 
                      const Icon(Icons.person, size: 40, color: Colors.cyan),
                ),
              )
            : const Icon(Icons.person, size: 40, color: Colors.cyan),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doctor.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 5),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.orange, size: 16),
                    const SizedBox(width: 4),
                  ],
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () {
              print("Đi tới trang chi tiết của bác sĩ: ${doctor.fullName}, ID: ${doctor.id}, Avatar: ${doctor.avatarUrl}, Chuyên khoa: ${doctor.specialtyName}, Đánh giá: ${doctor.rating}");
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DoctorProfileScreen(doctorId: doctor.id),
                ),
              );
            },
            child: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey)
          ),
        ],
      ),
    );
  }
}
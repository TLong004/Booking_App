import 'package:flutter/material.dart';
import 'package:myapp/pages/home/screens/create_patient_screen.dart';

class MyAddbutton extends StatelessWidget {
  final bool isSelfTab;
  const MyAddbutton({super.key, required this.isSelfTab});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () async {
        await Navigator.push(context, MaterialPageRoute(
          builder: (_) => CreatePatientScreen(isOwner: isSelfTab),
        ));
      },
      icon: const Icon(Icons.add_circle_outline),
      label: Text(isSelfTab ? "Tạo hồ sơ bản thân" : "Thêm hồ sơ người thân"),
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF00B4D8),
        side: const BorderSide(color: Color(0xFF00B4D8)),
        minimumSize: const Size(double.infinity, 52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
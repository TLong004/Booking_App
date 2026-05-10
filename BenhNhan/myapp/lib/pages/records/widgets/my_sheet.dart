import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/pages/records/widgets/edit_patient_sheet.dart';

class MySheet {
  static void confirmDelete(BuildContext context, PatientModel patient) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text("Xóa hồ sơ"),
        content: Text("Bạn có chắc muốn xóa hồ sơ \"${patient.fullName}\" không?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Hủy", style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<PatientBloc>().add(DeletePatient(patient.id!));
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text("Xóa", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  static void showEditSheet(BuildContext context, PatientModel patient) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => EditPatientSheet(patient: patient),
    ).then((_) {
    });
  }
}
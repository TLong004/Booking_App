import 'package:flutter/material.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/pages/records/widgets/my_addbutton.dart';
import 'package:myapp/pages/records/widgets/my_patient_card.dart';

class MyTab extends StatelessWidget {
  final bool isSelfTab;
  final List<PatientModel> list;
  const MyTab({super.key, required this.isSelfTab, required this.list});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      itemCount: list.length + 1,
      itemBuilder: (context, index) {
        if (index == list.length) {
          if (isSelfTab && list.isNotEmpty) return const SizedBox.shrink();
          return MyAddbutton(isSelfTab: isSelfTab);
        }
        return MyPatientCard(patient: list[index]);
      },
    );
  }
}
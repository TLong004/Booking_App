import 'package:flutter/material.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/pages/appointments/widgets/appointment_card.dart';
import 'package:myapp/pages/appointments/widgets/detail_bottom_sheet.dart';

class ListApointment extends StatelessWidget {
  final List<AppointmentModel> list;
  final bool showCancel;

  const ListApointment({super.key, required this.list, this.showCancel = false});

  @override
  Widget build(BuildContext context) {
    if (list.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.calendar_today_outlined, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 12),
            Text("Không có lịch hẹn nào",
                style: TextStyle(color: Colors.grey.shade400, fontSize: 15)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      itemCount: list.length,
      itemBuilder: (_, i) => AppointmentCard(
        appointment: list[i],
        showCancel: showCancel && list[i].status == 'PENDING',
        onCancel: () => DetailBottomSheet.showCancelSheet(context, list[i]),
        onTap: () => DetailBottomSheet.show(context, list[i]),
      ),
    );
  }
}
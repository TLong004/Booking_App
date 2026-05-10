import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/appointment/appointment_bloc.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/pages/appointments/widgets/cancel_sheet.dart';
import 'package:myapp/pages/appointments/widgets/detail_sheet.dart';

class DetailBottomSheet {
  static void show(BuildContext context, AppointmentModel appointment) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => DetailSheet(
        appointment: appointment,
        onCancel: appointment.status == 'PENDING'
            ? () {
                Navigator.pop(context);
                showCancelSheet(context, appointment);
              }
            : null,
      ),
    );
  }
  static void showCancelSheet(BuildContext context, AppointmentModel appointment) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => CancelSheet(
        appointment: appointment,
        onConfirm: (reason) {
          context.read<AppointmentBloc>().add(
                CancelAppointment(id: appointment.id, cancelReason: reason),
              );
        },
      ),
    );
  }
}
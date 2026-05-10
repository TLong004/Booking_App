part of 'appointment_bloc.dart';

sealed class AppointmentEvent extends Equatable {
  const AppointmentEvent();
  @override
  List<Object?> get props => [];
}

final class GetAppointments extends AppointmentEvent {
  const GetAppointments();
}

final class CancelAppointment extends AppointmentEvent {
  final int id;
  final String cancelReason;
  const CancelAppointment({required this.id, required this.cancelReason});
  @override
  List<Object?> get props => [id, cancelReason];
}

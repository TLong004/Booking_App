part of 'appointment_bloc.dart';

sealed class AppointmentState extends Equatable {
  const AppointmentState();
  @override
  List<Object?> get props => [];
}

final class AppointmentInitial extends AppointmentState {}

final class AppointmentLoading extends AppointmentState {}

final class AppointmentLoaded extends AppointmentState {
  final List<AppointmentModel> appointments;
  const AppointmentLoaded(this.appointments);
  @override
  List<Object?> get props => [appointments];
}

final class AppointmentCancelled extends AppointmentState {}

final class AppointmentError extends AppointmentState {
  final String message;
  const AppointmentError(this.message);
  @override
  List<Object?> get props => [message];
}

part of 'patient_bloc.dart';

@immutable
sealed class PatientState extends Equatable {
  @override
  List<Object?> get props => [];
}

final class PatientInitial extends PatientState {}

final class PatientLoading extends PatientState {}

final class PatientLoaded extends PatientState {
  final List<PatientModel> patients;

  PatientLoaded(this.patients);

  @override
  List<Object?> get props => [patients];
}

final class PatientCreated extends PatientState {
  final PatientModel patient;
  PatientCreated(this.patient);
  @override
  List<Object?> get props => [patient];
}

final class PatientUpdated extends PatientState {
  final PatientModel patient;
  PatientUpdated(this.patient);
  @override
  List<Object?> get props => [patient];
}

final class PatientDeleted extends PatientState {
  final int id;
  PatientDeleted(this.id);
  @override
  List<Object?> get props => [id];
}

final class PatientError extends PatientState {
  final String message;

  PatientError(this.message);

  @override
  List<Object?> get props => [message];
}
part of 'patient_bloc.dart';

@immutable
sealed class PatientEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

final class GetPatients extends PatientEvent {}

final class CreatePatient extends PatientEvent {
  final Map<String, dynamic> data;
  CreatePatient(this.data);
  @override
  List<Object?> get props => [data];
}

final class UpdatePatient extends PatientEvent {
  final int id;
  final Map<String, dynamic> data;
  UpdatePatient(this.id, this.data);
  @override
  List<Object?> get props => [id, data];
}

final class DeletePatient extends PatientEvent {
  final int id;
  DeletePatient(this.id);
  @override
  List<Object?> get props => [id];
}

part of 'doctor_bloc.dart';

sealed class DoctorState extends Equatable {
  const DoctorState();
  @override
  List<Object> get props => [];
}

final class DoctorInitial extends DoctorState {}

final class DoctorLoading extends DoctorState {}

final class DoctorBySpecialtyLoaded extends DoctorState {
  final List<DoctorModel> doctors;
  const DoctorBySpecialtyLoaded(this.doctors);
  @override
  List<Object> get props => [doctors];
}

final class DoctorLoaded extends DoctorState {
  final List<DoctorModel> doctors;
  const DoctorLoaded(this.doctors);
  @override
  List<Object> get props => [doctors];
}

final class DoctorByServiceLoaded extends DoctorState {
  final List<DoctorModel> doctors;
  const DoctorByServiceLoaded(this.doctors);
  @override
  List<Object> get props => [doctors];
}


final class DoctorError extends DoctorState {
  final String message;
  const DoctorError(this.message);
  @override
  List<Object> get props => [message];
}

final class DoctorDetailLoaded extends DoctorState {
  final DoctorModel doctor;
  const DoctorDetailLoaded(this.doctor);
  @override
  List<Object> get props => [doctor];
}

final class DateLoaded extends DoctorState {
  final List<String> availableDates;
  const DateLoaded(this.availableDates);
  @override
  List<Object> get props => [availableDates];
}

// Trong doctor_state.dart
final class SlotLoaded extends DoctorState {
  final List<String> availableDates; 
  final List<WorkScheduleModel> availableSlots; 
  
  const SlotLoaded(this.availableDates, this.availableSlots);

  @override
  List<Object> get props => [availableDates, availableSlots];
}

final class DatesLoading extends DoctorState {}

final class SlotsLoading extends DoctorState {}
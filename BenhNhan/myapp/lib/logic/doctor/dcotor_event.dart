part of 'doctor_bloc.dart';

abstract class DoctorEvent extends Equatable {
  const DoctorEvent();

  @override
  List<Object> get props => [];
}

class GetDoctorsBySpecialty extends DoctorEvent {
  final int specialtyId;
  const GetDoctorsBySpecialty(this.specialtyId);

  @override
  List<Object> get props => [specialtyId];
}

class GetDoctorsByService extends DoctorEvent {
  final int serviceId;
  const GetDoctorsByService(this.serviceId);

  @override
  List<Object> get props => [serviceId];
}

class SearchDoctors extends DoctorEvent {
  final String query;
  const SearchDoctors(this.query);  
  @override
  List<Object> get props => [query];
}

class FilterRating extends DoctorEvent {
  final double rating;
  const FilterRating(this.rating);  
  @override
  List<Object> get props => [rating];
}

class GetDoctorDetail extends DoctorEvent {
  final int doctorId;
  const GetDoctorDetail(this.doctorId);  
  @override
  List<Object> get props => [doctorId];
}

class GetSheduledDoctors extends DoctorEvent {
  final int id;
  const GetSheduledDoctors(this.id);  
  @override
  List<Object> get props => [id];
}

class LoadAvailableDates extends DoctorEvent {
  final int doctorId;
  const LoadAvailableDates(this.doctorId);  
  @override
  List<Object> get props => [doctorId];
}

class LoadAvailableSlots extends DoctorEvent {
  final int doctorId;
  final String date;
  const LoadAvailableSlots(this.doctorId, this.date);  
  @override
  List<Object> get props => [doctorId, date];
}

class GetTopDoctors extends DoctorEvent {
  const GetTopDoctors();
  
  @override
  List<Object> get props => [];
}

class GetAllDoctors extends DoctorEvent {
  const GetAllDoctors();
  
  @override
  List<Object> get props => [];
}

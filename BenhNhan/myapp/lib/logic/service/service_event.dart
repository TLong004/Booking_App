part of 'service_bloc.dart';

sealed class ServiceEvent extends Equatable {
  const ServiceEvent();
  @override
  List<Object> get props => [];
}

final class GetServicesBySpecialty extends ServiceEvent {
  final int specialtyId;
  const GetServicesBySpecialty({required this.specialtyId});
  @override
  List<Object> get props => [specialtyId];
}

final class GetServicesByDoctor extends ServiceEvent {
  final int doctorId;
  const GetServicesByDoctor({required this.doctorId});
  @override
  List<Object> get props => [doctorId];
}

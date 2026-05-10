part of 'service_bloc.dart';


sealed class ServiceState extends Equatable {
  const ServiceState();
  @override
  List<Object> get props => [];
}

final class ServiceInitial extends ServiceState {}

final class ServiceLoading extends ServiceState {}

final class ServiceBySpecialtyLoaded extends ServiceState {
  final List<ServiceModel> services;
  const ServiceBySpecialtyLoaded(this.services);
  @override
  List<Object> get props => [services];
}

final class ServiceError extends ServiceState {
  final String message;
  const ServiceError(this.message);
  @override
  List<Object> get props => [message];
}

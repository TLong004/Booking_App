part of 'specialty_bloc.dart';

sealed class SpecialtyState extends Equatable {
  const SpecialtyState();
  @override
  List<Object?> get props => [];
}

final class SpecialtyInitial extends SpecialtyState {}

final class SpecialtyLoading extends SpecialtyState {}

final class SpecialtyLoaded extends SpecialtyState {
  final List<SpecialtyModel> specialties;
  const SpecialtyLoaded(this.specialties);

  @override
  List<Object?> get props => [specialties];
}

final class SpecialtyError extends SpecialtyState {
  final String message;
  const SpecialtyError(this.message);

  @override
  List<Object?> get props => [message];
}
// specialty_event.dart
part of 'specialty_bloc.dart';

sealed class SpecialtyEvent extends Equatable {
  const SpecialtyEvent();
  @override
  List<Object> get props => [];
}

class FetchSpecialties extends SpecialtyEvent {}
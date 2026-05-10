part of 'booking_bloc.dart';

sealed class BookingState extends Equatable {
  const BookingState();
  @override
  List<Object?> get props => [];
}

final class BookingInitial extends BookingState {}

final class BookingLoading extends BookingState {}

final class BookingSuccess extends BookingState {
  final String message;
  final int? appointmentId;
  const BookingSuccess({required this.message, this.appointmentId});
  @override
  List<Object?> get props => [message, appointmentId];
}

final class BookingError extends BookingState {
  final String message;
  const BookingError(this.message);
  @override
  List<Object?> get props => [message];
}

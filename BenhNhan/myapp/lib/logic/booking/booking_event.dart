part of 'booking_bloc.dart';

sealed class BookingEvent extends Equatable {
  const BookingEvent();
  @override
  List<Object?> get props => [];
}

final class CreateBooking extends BookingEvent {
  final int patientId;
  final int doctorId;
  final int scheduleId;
  final String symptoms;

  const CreateBooking({
    required this.patientId,
    required this.doctorId,
    required this.scheduleId,
    required this.symptoms,
  });

  @override
  List<Object?> get props => [patientId, doctorId, scheduleId, symptoms];
}

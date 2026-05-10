import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:myapp/repositories/booking_reponsitory.dart';

part 'booking_event.dart';
part 'booking_state.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final BookingReponsitory _repository = BookingReponsitory();

  BookingBloc() : super(BookingInitial()) {
    on<CreateBooking>((event, emit) async {
      emit(BookingLoading());
      try {
        final result = await _repository.createBooking(
          patientId: event.patientId,
          doctorId: event.doctorId,
          scheduleId: event.scheduleId,
          symptoms: event.symptoms,
        );
        emit(BookingSuccess(
          message: result['message'] as String? ?? 'Đặt lịch thành công!',
          appointmentId: result['appointmentId'] as int?,
        ));
      } catch (e) {
        emit(BookingError(e.toString().replaceAll('Exception: ', '')));
      }
    });
  }
}

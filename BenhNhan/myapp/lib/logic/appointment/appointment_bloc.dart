import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:myapp/models/appointment.dart';
import 'package:myapp/repositories/appointment_repository.dart';

part 'appointment_event.dart';
part 'appointment_state.dart';

class AppointmentBloc extends Bloc<AppointmentEvent, AppointmentState> {
  final AppointmentRepository _repository = AppointmentRepository();

  AppointmentBloc() : super(AppointmentInitial()) {
    on<GetAppointments>((event, emit) async {
      emit(AppointmentLoading());
      try {
        final list = await _repository.getBookings();
        emit(AppointmentLoaded(list));
      } catch (e) {
        emit(AppointmentError(e.toString().replaceAll('Exception: ', '')));
      }
    });

    on<CancelAppointment>((event, emit) async {
      emit(AppointmentLoading());
      try {
        await _repository.cancelBooking(event.id, event.cancelReason);
        emit(AppointmentCancelled());
      } catch (e) {
        emit(AppointmentError(e.toString().replaceAll('Exception: ', '')));
      }
    });
  }
}

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/models/work_schedule.dart';
import 'package:myapp/repositories/doctor_reponsitory.dart';
import 'package:stream_transform/stream_transform.dart';

part 'dcotor_event.dart';
part 'doctor_state.dart';

EventTransformer<E> debounce<E>(Duration duration) {
  return (events, mapper) => events.debounce(duration).switchMap(mapper);
}

class DoctorBloc extends Bloc<DoctorEvent, DoctorState> {
  final DoctorReponsitory _doctorRepository = DoctorReponsitory();
  DoctorBloc() : super(DoctorInitial()) {
    on<GetDoctorsBySpecialty>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctors =
            await _doctorRepository.getDoctorBySpecialty(event.specialtyId);
        emit(DoctorBySpecialtyLoaded(doctors));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });
    on<GetDoctorsByService>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctors =
            await _doctorRepository.getDoctorByService(event.serviceId);
        emit(DoctorByServiceLoaded(doctors));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });
    on<SearchDoctors>(
      (event, emit) async {
        if (event.query.trim().isEmpty) {
          emit(DoctorInitial()); 
          return;
        }

        emit(DoctorLoading());
        try {
          final doctors = await _doctorRepository.searchDoctors(event.query);
          emit(DoctorLoaded(doctors));
        } catch (e) {
          emit(DoctorError(e.toString()));
        }
      },
      transformer: debounce(const Duration(milliseconds: 500)),
    );
    on<FilterRating>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctors = await _doctorRepository.filterRating(event.rating);
        emit(DoctorLoaded(doctors));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });
    on<GetDoctorDetail>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctor = await _doctorRepository.getDoctorDetail(event.doctorId);
        emit(DoctorDetailLoaded(doctor));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });

    on<LoadAvailableDates>((event, emit) async {
      emit(DatesLoading());
      try {
        final dates = await _doctorRepository.getAvailableDates(event.doctorId);
        emit(DateLoaded(dates));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });

    on<LoadAvailableSlots>((event, emit) async {
      final currentState = state;
      List<String> currentDates = [];
      if (currentState is DateLoaded) currentDates = currentState.availableDates;
      if (currentState is SlotLoaded) currentDates = currentState.availableDates;
      emit(SlotsLoading()); 
      try {
        final slots = await _doctorRepository.getAvailableSlots(event.doctorId, event.date);
        emit(SlotLoaded(currentDates, slots)); 
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });

    on<GetTopDoctors>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctors = await _doctorRepository.getTopDoctors();
        emit(DoctorLoaded(doctors));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });

    on<GetAllDoctors>((event, emit) async {
      emit(DoctorLoading());
      try {
        final doctors = await _doctorRepository.getAllDoctors();
        emit(DoctorLoaded(doctors));
      } catch (e) {
        emit(DoctorError(e.toString()));
      }
    });
  }
}

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:myapp/models/service.dart';
import 'package:myapp/repositories/doctor_reponsitory.dart';
import 'package:myapp/repositories/specialty_reponsitory.dart';

part 'service_event.dart';
part 'service_state.dart';

class ServiceBloc extends Bloc<ServiceEvent, ServiceState> {
  final SpecialtyRepository _repository = SpecialtyRepository();
  final DoctorReponsitory _doctorRepository = DoctorReponsitory();

  ServiceBloc() : super(ServiceInitial()) {
    on<GetServicesBySpecialty>((event, emit) async {
      emit(ServiceLoading());
      try {
        final services = await _repository.getServicesBySpecialty(event.specialtyId);
        emit(ServiceBySpecialtyLoaded(services));
      } catch (e) {
        emit(ServiceError(e.toString().replaceAll('Exception: ', '')));
      }
    });
    on<GetServicesByDoctor>((event, emit) async {
      emit(ServiceLoading());
      try {
        final services = await _doctorRepository.getServicesByDoctor(event.doctorId);
        emit(ServiceBySpecialtyLoaded(services.map((e) => ServiceModel.fromJson(e)).toList()));
      } catch (e) {
        emit(ServiceError(e.toString().replaceAll('Exception: ', '')));
      }
    });
  }
}
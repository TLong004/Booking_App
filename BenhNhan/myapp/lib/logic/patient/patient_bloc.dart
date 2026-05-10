import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/repositories/patient_reponsitory.dart';

part 'patient_event.dart';
part 'patient_state.dart';

class PatientBloc extends Bloc<PatientEvent, PatientState> {
  final PatientReponsitory _patientRepository = PatientReponsitory();
  PatientBloc() : super(PatientInitial()) {
    on<GetPatients>((event, emit) async {
      emit(PatientLoading());
      try {
        final patients = await _patientRepository.getPatients();
        emit(PatientLoaded(patients));
      } catch (e) {
        emit(PatientError(e.toString()));
      }
    });

    on<CreatePatient>((event, emit) async {
      emit(PatientLoading());
      try {
        final patient = await _patientRepository.createPatient(event.data);
        emit(PatientCreated(patient));
      } catch (e) {
        emit(PatientError(e.toString()));
      }
    });

    on<UpdatePatient>((event, emit) async {
      emit(PatientLoading());
      try {
        final patient = await _patientRepository.updatePatient(event.id, event.data);
        emit(PatientUpdated(patient));
      } catch (e) {
        emit(PatientError(e.toString()));
      }
    });

    on<DeletePatient>((event, emit) async {
      emit(PatientLoading());
      try {
        await _patientRepository.deletePatient(event.id);
        emit(PatientDeleted(event.id));
      } catch (e) {
        emit(PatientError(e.toString()));
      }
    });
  }
}

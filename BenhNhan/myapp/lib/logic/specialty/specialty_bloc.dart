import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:myapp/models/specialty.dart';
import 'package:myapp/repositories/specialty_reponsitory.dart';

part 'specialty_event.dart';
part 'specialty_state.dart';

class SpecialtyBloc extends Bloc<SpecialtyEvent, SpecialtyState> {
  final SpecialtyRepository _specialtyRepository = SpecialtyRepository();
  SpecialtyBloc() : super(SpecialtyInitial()) {
    on<SpecialtyEvent>((event, emit) {

    });
    on<FetchSpecialties>((event, emit) async {
      try {
        emit(SpecialtyLoading());
        final specialties = await _specialtyRepository.getAllspecialties();
        emit(SpecialtyLoaded(specialties));
      } catch (e) {
        emit(SpecialtyError(e.toString()));
      }
    });
  }
}

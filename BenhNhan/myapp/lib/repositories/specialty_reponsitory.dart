import 'package:myapp/models/service.dart';
import 'package:myapp/models/specialty.dart';
import 'package:myapp/services/service_service.dart';
import 'package:myapp/services/specialty_service.dart';

class SpecialtyRepository {
  final SpecialtyService _specialtyService = SpecialtyService();
  final ServiceService _serviceService = ServiceService();

  Future<List<SpecialtyModel>> getAllspecialties() async {
    final response = await _specialtyService.getAllspecialties();
    return response.map((e) => SpecialtyModel.fromJson(e)).toList();
  }


  Future<List<ServiceModel>> getServicesBySpecialty(int id) async {
    final response = await _serviceService.getServicesBySpecialty(id);
    return response.map((e) => ServiceModel.fromJson(e)).toList();
  }
}
import 'package:intl/intl.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/models/work_schedule.dart';
import 'package:myapp/services/doctor_service.dart';
import 'package:myapp/services/service_service.dart';

class DoctorReponsitory {
  final DoctorService _doctorService = DoctorService();
  final ServiceService _serviceService = ServiceService();

  Future<List<DoctorModel>> getDoctorBySpecialty(int id) async {
    final response = await _doctorService.getDoctorBySpecialty(id);
    return response.map((e) => DoctorModel.fromJson(e)).toList();
  }

  Future<List<DoctorModel>> getAllDoctors() async {
    final response = await _doctorService.getAllDoctors();
    return response.map((e) => DoctorModel.fromJson(e)).toList();
  }

  Future<List<DoctorModel>> getDoctorByService(int id) async {
    final response = await _doctorService.getDoctorByService(id);
    return response.map((e) => DoctorModel.fromJson(e)).toList();
  }

  Future<List<DoctorModel>> searchDoctors(String query) async {
    final response = await _doctorService.searchDoctors(query);
    return response.map((e) => DoctorModel.fromJson(e)).toList();
  }

  Future<List<DoctorModel>> filterRating(double rating) async {
    final response = await _doctorService.filterRating(rating);
    return response.map((e) => DoctorModel.fromJson(e)).toList();
  }

  Future<DoctorModel> getDoctorDetail(int id) async {
    final response = await _doctorService.getDoctorDetail(id);
    return DoctorModel.fromJson(response);
  }


  Future<List<dynamic>> getServicesByDoctor(int id) async {
    try {
      final response = await _serviceService.getServicesByDoctor(id);
      return response;
    } catch (e) {
       throw Exception(e.toString());
    }
  }
  Future<List<String>> getAvailableDates(int doctorId) async {
    try {
      final fmt = DateFormat('yyyy-MM-dd');
      final from = fmt.format(DateTime.now());
      final to = fmt.format(DateTime.now().add(const Duration(days: 30)));
      final response = await _doctorService.getAvailableDates(doctorId, from, to);
      return List<String>.from(response);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<WorkScheduleModel>> getAvailableSlots(int doctorId, String date) async {
    try {
      final response = await _doctorService.getAvailableSlots(doctorId, date);
      return List<WorkScheduleModel>.from(response);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<DoctorModel>> getTopDoctors() async {
    try {
      final response = await _doctorService.getTopDoctors();
      return List<DoctorModel>.from(response);
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}

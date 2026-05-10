import 'package:myapp/models/patient.dart';
import 'package:myapp/services/patient_service.dart';

class PatientReponsitory {
  final PatientService _patientService = PatientService();

  Future<List<PatientModel>> getPatients() async {
    try {
      return await _patientService.getPatients();
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<PatientModel> createPatient(Map<String, dynamic> data) async {
    try {
      return await _patientService.createPatient(data);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<PatientModel> updatePatient(int id, Map<String, dynamic> data) async {
    try {
      return await _patientService.updatePatient(id, data);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> deletePatient(int id) async {
    try {
      await _patientService.deletePatient(id);
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}
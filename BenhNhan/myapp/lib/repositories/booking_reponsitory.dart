import 'package:myapp/services/booking_service.dart';

class BookingReponsitory {
  final BookingService _bookingService = BookingService();

  Future<Map<String, dynamic>> createBooking({
    required int patientId,
    required int doctorId,
    required int scheduleId,
    required String symptoms,
  }) async {
    try {
      return await _bookingService.createBooking({
        'patientId': patientId,
        'doctorId': doctorId,
        'scheduleId': scheduleId,
        'symptoms': symptoms,
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}

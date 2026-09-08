import { Metadata } from "next";
import BookAppointmentContainer from "./pageContainer";

export const metadata: Metadata = {
  title: "Book an appointment",
};

export default function BookAppointment() {
  return <BookAppointmentContainer />;
}

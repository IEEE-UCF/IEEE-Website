import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterField() {
  return (
    <div className="flex justify-center">
    <div className="w-full max-w-lg bg-white p-10 rounded-lg">
      <form>
        <FieldGroup>

          <FieldSet>
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold underline underline-offset-4">
                IEEE @ UCF Registration
              </h1>
            </div>
            <div className="flex justify-center">
              <h2>
                Become a member of IEEE @ UCF!
              </h2>
            </div>

            <FieldGroup>
              <Field orientation="horizontal">
                <Button variant="outline" type="button" className="text-white bg-indigo-600">
                  Signup with Discord
                </Button>
              </Field>

              <Field>
                <FieldLabel htmlFor="first_name">
                  First Name
                </FieldLabel>
                <Input
                  id="first_name"
                  placeholder="Jane"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="middle_name">
                  Middle Name
                </FieldLabel>
                <Input
                  id="middle_name"
                  placeholder="Dunny"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="last_name">
                  Last Name
                </FieldLabel>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="ucf_email">
                  UCF Email
                </FieldLabel>
                <Input
                  id="ucf_email"
                  type="email"
                  placeholder="ja123456@ucf.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="personal_email">
                  Personal Email
                </FieldLabel>
                <Input
                  id="personal_email"
                  type="email"
                  placeholder="jane.doe@gmail.com"
                  required
                />
              </Field>

              <div className="-mb-4 underline underline-offset-4">
                <h2>
                  Date of Birth
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="dob_month">
                    Month
                  </FieldLabel>
                  <Input id="dob_month" placeholder="MM" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="dob_day">
                    Day
                  </FieldLabel>
                  <Input id="dob_day" placeholder="DD" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="dob_year">
                    Year
                  </FieldLabel>
                  <Input id="dob_year" placeholder="YYYY" required />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="phone_num">
                  Phone Number
                </FieldLabel>
                <Input
                  id="phone_num"
                  placeholder="(407) 123-4567"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="gender">
                  Gender
                </FieldLabel>
                <Select defaultValue="">
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Not Selected" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="NB">Non-Binary</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                      <SelectItem value="PNTS">Prefer Not To Say</SelectItem>
                    </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="ucf_grad_year">
                  Graduation Year
                </FieldLabel>
                <Input
                  id="ucf_grad_year"
                  placeholder="2077"
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="ucf_major">
                  Major
                </FieldLabel>
                <Input
                  id="ucf_major"
                  placeholder="Electrical Engineering"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button variant="outline" type="submit" className="bg-yellow-400">
              Submit
            </Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>

        </FieldGroup>
      </form>
    </div>
    </div>
  )
}

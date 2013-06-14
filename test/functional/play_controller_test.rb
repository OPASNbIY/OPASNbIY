require 'test_helper'

class PlayControllerTest < ActionController::TestCase
  test "should get result" do
    get :result
    assert_response :success
  end

end
